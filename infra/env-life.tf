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

# Compute - Machines

resource "google_compute_instance" "live-core-1" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-compute-core-1"
  description = "Machine of the core cluster"
  zone = "${var.live_region_and_zone}"

  machine_type = "n1-standard-1"

  metadata_startup_script = "echo hi > /test.txt"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      type = "pd-standard"
    }
  }

  network_interface {
    subnetwork = "${google_compute_subnetwork.live-subnetwork.self_link}"
    subnetwork_project = "${google_project.live.id}"
  }

  scheduling {
    preemptible = false
    on_host_maintenance = "MIGRATE"
    automatic_restart = true
  }

  service_account {
    email = "${google_service_account.live-service-core.email}"
    scopes = ["userinfo-email", "compute-ro", "storage-ro"]
  }

  metadata {
    serial-port-enable = "1"
  }

  allow_stopping_for_update = false
  can_ip_forward = false
  deletion_protection = "true"

  depends_on = [ "google_sql_database_instance.live-sqldb-main" ]
}

resource "google_compute_instance_group" "live-core" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-compute-core"
  description = "Group of machines from the core cluster"
  zone = "${var.live_region_and_zone}"

  network = "${google_compute_network.live-network.self_link}"

  instances = [
    "${google_compute_instance.live-core-1.self_link}"
  ]

  named_port {
    name = "http"
    port = "${var.core_http_port}"
  }
}

# Ingress - Loadbalancer

resource "google_compute_global_address" "live" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-loadbalancer-address"
  ip_version = "IPV4"
}

resource "google_compute_health_check" "live-core-healthcheck" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-healthcheck-core"
  description = "The healthcheck for the core machines instances"

  check_interval_sec = 5
  timeout_sec = 1
  healthy_threshold = 2
  unhealthy_threshold = 2

  http_health_check {
    host = "" # Will set the Host header to the public IP on behalf of which the check is made
    proxy_header = "NONE"
    request_path = "${var.core_health_check_path}"
    port = "${var.core_http_port}"
  }
}

resource "google_compute_backend_service" "live-core" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-backend-core"
  description = "The backend for the live core machines"

  port_name = "http"
  protocol = "HTTP"
  timeout_sec = 10
  connection_draining_timeout_sec = 300
  enable_cdn = false
  session_affinity = "NONE"

  backend {
    description = "The backend for the core machines"
    group = "${google_compute_instance_group.live-core.self_link}"
    balancing_mode = "UTILIZATION"
    capacity_scaler = 1.0
  }

  health_checks = ["${google_compute_health_check.live-core-healthcheck.self_link}"]
}

resource "google_compute_url_map" "live" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-urlmap"
  description = "The URL map for the live machines"

  default_service = "${google_compute_backend_service.live-core.self_link}"

  host_rule {
    hosts = [ "${var.live_external_host}" ]
    path_matcher = "allpaths"
  }

  path_matcher {
    name = "allpaths"
    default_service = "${google_compute_backend_service.live-core.self_link}"
  }
}

resource "google_compute_target_http_proxy" "live" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-httpproxy"
  description = "The HTTP proxy for the live machines"

  url_map = "${google_compute_url_map.live.self_link}"
}

# TODO(horia141): https proxy

resource "google_compute_global_forwarding_rule" "live-http" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-globalfwdrule"
  description = "The global forwarding rule for HTTP traffic to te live core cluster"
  target = "${google_compute_target_http_proxy.live.self_link}"

  ip_address = "${google_compute_global_address.live.address}"
  ip_protocol = "TCP"
  port_range = "80"
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
  rrdatas = [ "${google_compute_global_address.live.address}" ]
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

resource "google_dns_managed_zone" "live-retrofeed-chm-sqrt2-io" {
  project = "${google_project.live.id}"

  name = "chm-sqrt2-retrofeed-live-retrofeed-chm-sqrt2-io"
  description = "Main technical domain"

  dns_name = "retrofeed.chm-sqrt2.io."
}

resource "google_dns_record_set" "live-core-retrofeed-chm-sqrt2-io-a-res" {
  project = "${google_project.live.id}"
  managed_zone = "${google_dns_managed_zone.live-retrofeed-chm-sqrt2-io.name}"

  name = "core.live.${google_dns_managed_zone.live-retrofeed-chm-sqrt2-io.dns_name}"
  type = "A"
  ttl = "300"
  rrdatas = [ "${google_compute_global_address.live.address}" ]
}
