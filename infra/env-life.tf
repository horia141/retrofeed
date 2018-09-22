# Project config

resource "google_project" "live" {
  name = "Env - Live"
  project_id = "chm-sqrt2-retrofeed-live"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"
}

resource "google_project_services" "live-services" {
  project = "${google_project.live.id}"

  services = [
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
    "bigquery-json.googleapis.com"
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

# Compute - VMs

# Ingress - Loadbalancer

# Ingress - DNS
