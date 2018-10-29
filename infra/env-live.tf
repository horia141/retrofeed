# Project config

resource "google_project" "live" {
  name = "Env - Live"
  project_id = "chm-sqrt2-retrofeed-live"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"

  app_engine {
    location_id = "${var.live_region}"
  }
}

resource "google_project_services" "live-services" {
  project = "${google_project.live.id}"

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

resource "google_service_account" "live-service-core" {
  account_id = "service-core"
  display_name = "The service account under which the core application runs"
  project = "${google_project.live.id}"
}

resource "google_project_iam_binding" "live-cloudsql-clients" {
  project = "${google_project.live.id}"
  role = "roles/cloudsql.client"
  members = [
    "serviceAccount:${google_service_account.live-service-core.email}",
  ]
}

resource "google_project_iam_binding" "live-appengine-admin" {
  project = "${google_project.live.id}"
  role = "roles/appengine.appAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_project_iam_binding" "live-appengine-cloud-build-editor" {
  project = "${google_project.live.id}"
  role = "roles/cloudbuild.builds.editor"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_storage_bucket_iam_binding" "live-appengine-artifacts" {
  bucket = "${google_storage_bucket.live-appengine-artifacts.name}"
  role = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_storage_bucket_iam_binding" "live-appengine-staging" {
  bucket = "${google_storage_bucket.live-appengine-staging.name}"
  role = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

# Networking

resource "google_compute_network" "live-network" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-network"
  description = "Common network"
  auto_create_subnetworks = false
  routing_mode = "REGIONAL"

  depends_on = [ "google_project_services.live-services" ]
}

resource "google_compute_subnetwork" "live-subnetwork" {
  project = "${google_project.live.id}"
  network = "${google_compute_network.live-network.name}"

  name = "chm-sqrt2-retrofeed-live-subnetwork"
  description = "Subnetwork in the default live zone"
  region = "${var.live_region}"
  ip_cidr_range = "10.10.0.0/16"
  private_ip_google_access = true
}

resource "google_compute_firewall" "live-network-firewall" {
  project = "${google_project.live.id}"
  network = "${google_compute_network.live-network.name}"

  name = "chm-sqrt2-retrofeed-live-network-firewall"
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

resource "google_sql_database_instance" "live-sqldb-main" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-sqldb-main"
  database_version = "POSTGRES_9_6"
  region = "${var.live_region}"

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
      zone = "${var.live_region_and_zone}"
    }

    maintenance_window {
      day = 7
      hour = 6
      update_track = "stable"
    }
  }

  depends_on = [ "google_project_services.live-services" ]
}

resource "google_sql_user" "live-sqldb-main-user-core" {
  project = "${google_project.live.id}"
  instance = "${google_sql_database_instance.live-sqldb-main.name}"

  name = "service_core"
  password = "${var.live_sqldb_main_user_core_password}"
}

resource "google_sql_database" "live-sqldb-main-database" {
  project = "${google_project.live.id}"
  instance = "${google_sql_database_instance.live-sqldb-main.name}"

  name = "retrofeed"
  charset = "UTF8"
  collation = "en_US.UTF8"

  depends_on = [
    "google_sql_user.live-sqldb-main-user-core",
  ]
}

# Storage - AppEngine buckets (auto created)

resource "google_storage_bucket" "live-appengine-default" {
  name = "chm-sqrt2-retrofeed-live.appspot.com"
  project = "${google_project.live.id}"
  storage_class = "STANDARD"
  location = "${var.live_region}"
}

resource "google_storage_bucket" "live-appengine-artifacts" {
  name = "eu.artifacts.chm-sqrt2-retrofeed-live.appspot.com"
  project = "${google_project.live.id}"
  storage_class = "STANDARD"
  location = "eu"
}

resource "google_storage_bucket" "live-appengine-staging" {
  name = "staging.chm-sqrt2-retrofeed-live.appspot.com"
  project = "${google_project.live.id}"
  storage_class = "STANDARD"
  location = "${var.live_region}"

  lifecycle_rule {
    action {
      type = "Delete"
    }

    condition {
      age = "15"
    }
  }
}

# Ingress - DNS

resource "google_dns_managed_zone" "live-retrofeed-io" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-retrofeed-io"
  description = "Main domain"

  dns_name = "retrofeed.io."
}

resource "google_dns_record_set" "live-retrofeed-io-a-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-io.name}"

  name = "${google_dns_managed_zone.live-retrofeed-io.dns_name}"
  type = "A"
  ttl = "300"
  rrdatas = [ "216.239.32.21", "216.239.34.21", "216.239.36.21", "216.239.38.21" ]
}

resource "google_dns_record_set" "live-retrofeed-io-aaaa-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-io.name}"

  name = "${google_dns_managed_zone.live-retrofeed-io.dns_name}"
  type = "AAAA"
  ttl = "300"
  rrdatas = [ "2001:4860:4802:32::15", "2001:4860:4802:34::15", "2001:4860:4802:36::15", "2001:4860:4802:38::15" ]
}

resource "google_dns_record_set" "live-retrofeed-io-txt-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-io.name}"

  name = "${google_dns_managed_zone.live-retrofeed-io.dns_name}"
  type = "TXT"
  ttl = "300"
  rrdatas = [ "google-site-verification=lWwzTXDBrp2SJz3VD32PR5SymeNy2Tj75uNPWwRODJo" ]
}


resource "google_dns_record_set" "live-retrofeed-io-cname-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-io.name}"

  name = "www.${google_dns_managed_zone.live-retrofeed-io.dns_name}"
  type = "CNAME"
  ttl = "300"
  rrdatas = [ "ghs.googlehosted.com." ]
}

resource "google_dns_record_set" "live-retrofeed-io-mx-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-io.name}"

  name = "${google_dns_managed_zone.live-retrofeed-io.dns_name}"
  type = "MX"
  ttl = "3600"
  rrdatas = [
    "1 aspmx.l.google.com.",
    "5 alt1.aspmx.l.google.com.",
    "5 alt2.aspmx.l.google.com.",
    "10 alt3.aspmx.l.google.com.",
    "10 alt4.aspmx.l.google.com."
  ]
}
