# Project config

resource "google_project" "staging" {
  name = "Env - Staging"
  project_id = "chm-sqrt2-retrofeed-staging"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"

  app_engine {
    location_id = "${var.staging_region}"
  }
}

resource "google_project_services" "staging-services" {
  project = "${google_project.staging.id}"

  services = [
    "appengine.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "maps-embed-backend.googleapis.com",
    "maps-backend.googleapis.com",
    "places-backend.googleapis.com",
    "sqladmin.googleapis.com",
    "sql-component.googleapis.com",
    "containerregistry.googleapis.com",
    "pubsub.googleapis.com",
    "deploymentmanager.googleapis.com",
    "replicapool.googleapis.com",
    "replicapoolupdater.googleapis.com",
    "resourceviews.googleapis.com",
    "container.googleapis.com",
    "storage-api.googleapis.com",
    "oslogin.googleapis.com",
    "bigquery-json.googleapis.com",
    "cloudbuild.googleapis.com",
    "logging.googleapis.com"
  ]
}

# Accounts and their permissions

resource "google_service_account" "staging-service-core" {
  account_id = "service-core"
  display_name = "The service account under which the core application runs"
  project = "${google_project.staging.id}"
}

resource "google_project_iam_binding" "staging-cloudsql-clients" {
  project = "${google_project.staging.id}"
  role = "roles/cloudsql.client"
  members = [
    "serviceAccount:${google_service_account.staging-service-core.email}",
  ]
}

resource "google_project_iam_binding" "staging-appengine-admin" {
  project = "${google_project.staging.id}"
  role = "roles/appengine.appAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_project_iam_binding" "staging-appengine-cloud-build-editor" {
  project = "${google_project.staging.id}"
  role = "roles/cloudbuild.builds.editor"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_storage_bucket_iam_binding" "staging-appengine-artifacts" {
  bucket = "${google_storage_bucket.staging-appengine-artifacts.name}"
  role = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_storage_bucket_iam_binding" "staging-appengine-staging" {
  bucket = "${google_storage_bucket.staging-appengine-staging.name}"
  role = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

# Networking

resource "google_compute_network" "staging-network" {
  project = "${google_project.staging.id}"

  name = "chm-sqrt2-retrofeed-staging-network"
  description = "Common network"
  auto_create_subnetworks = false
  routing_mode = "REGIONAL"

  depends_on = [ "google_project_services.staging-services" ]
}

resource "google_compute_subnetwork" "staging-subnetwork" {
  project = "${google_project.staging.id}"
  network = "${google_compute_network.staging-network.name}"

  name = "chm-sqrt2-retrofeed-staging-subnetwork"
  description = "Subnetwork in the default staging zone"
  region = "${var.staging_region}"
  ip_cidr_range = "10.10.0.0/16"
  private_ip_google_access = true
}

resource "google_compute_firewall" "staging-network-firewall" {
  project = "${google_project.staging.id}"
  network = "${google_compute_network.staging-network.name}"

  name = "chm-sqrt2-retrofeed-staging-network-firewall"
  description = "The firewall rules for the common network"

  priority = 1000
  direction = "INGRESS"

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports = [ 22, 80, 443 ] # SSH
  }
}

# Storage - SQL Database

resource "google_sql_database_instance" "staging-sqldb-main" {
  project = "${google_project.staging.id}"

  name = "chm-sqrt2-retrofeed-staging-sqldb-main"
  database_version = "POSTGRES_9_6"
  region = "${var.staging_region}"

  settings {
    tier = "db-f1-micro"
    activation_policy = "ALWAYS"
    availability_type = "ZONAL"
    disk_autoresize = true
    disk_size = 10
    disk_type = "PD_SSD"

    backup_configuration {
      enabled = false
    }

    ip_configuration {
      ipv4_enabled = true
      require_ssl = false # TODO: Or perhaps it should be true
    }

    location_preference {
      zone = "${var.staging_region_and_zone}"
    }

    maintenance_window {
      day = 7
      hour = 6
      update_track = "stable"
    }
  }

  depends_on = [ "google_project_services.staging-services" ]
}

resource "google_sql_user" "staging-sqldb-main-user-core" {
  project = "${google_project.staging.id}"
  instance = "${google_sql_database_instance.staging-sqldb-main.name}"

  name = "service_core"
  password = "${var.staging_sqldb_main_user_core_password}"
}

resource "google_sql_database" "staging-sqldb-main-database" {
  project = "${google_project.staging.id}"
  instance = "${google_sql_database_instance.staging-sqldb-main.name}"

  name = "retrofeed"
  charset = "UTF8"
  collation = "en_US.UTF8"

  depends_on = [
    "google_sql_user.staging-sqldb-main-user-core",
  ]
}

# Storage - AppEngine buckets (auto created)

resource "google_storage_bucket" "staging-appengine-default" {
  name = "chm-sqrt2-retrofeed-staging.appspot.com"
  project = "${google_project.staging.id}"
  storage_class = "STANDARD"
  location = "${var.staging_region}"
}

resource "google_storage_bucket" "staging-appengine-artifacts" {
  name = "eu.artifacts.chm-sqrt2-retrofeed-staging.appspot.com"
  project = "${google_project.staging.id}"
  storage_class = "STANDARD"
  location = "eu"
}

resource "google_storage_bucket" "staging-appengine-staging" {
  name = "staging.chm-sqrt2-retrofeed-staging.appspot.com"
  project = "${google_project.staging.id}"
  storage_class = "STANDARD"
  location = "${var.staging_region}"

  lifecycle_rule {
    action {
      type = "Delete"
    }

    condition {
      age = "15"
    }
  }
}
