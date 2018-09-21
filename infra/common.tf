resource "google_service_account" "ci-terraformer" {
  account_id = "ci-terraformer"
  display_name = "CI Terraformer"
  project = "${google_project.common.id}"
}

resource "google_service_account" "ci-builder" {
  account_id = "ci-builder"
  display_name = "CI Builder"
  project = "${google_project.common.id}"
}

resource "google_organization_iam_binding" "chm-sqrt2-billing-user" {
  org_id = "${data.google_organization.chm-sqrt2.id}"
  role = "roles/billing.user"
  members = [
    "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_organization_iam_binding" "chm-sqrt2-billing-viewer" {
  org_id = "${data.google_organization.chm-sqrt2.id}"
  role = "roles/billing.viewer"
  members = [
    "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_organization_iam_binding" "chm-sqrt2-browsers" {
  org_id = "${data.google_organization.chm-sqrt2.id}"
  role = "roles/browser"
  members = [
    "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_folder_iam_binding" "retrofeed-project-creators" {
  folder = "${google_folder.retrofeed.name}"
  role = "roles/resourcemanager.projectCreator"
  members = [
    "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_folder_iam_binding" "retrofeed-viewers" {
  folder = "${google_folder.retrofeed.name}"
  role = "roles/viewer"
  members = [
      "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_project_iam_binding" "common-storage-admins" {
  project = "${google_project.common.id}"
  role = "roles/storage.admin"
  members = [
      "serviceAccount:${google_service_account.ci-terraformer.email}",
      "serviceAccount:${google_service_account.ci-builder.email}"
  ]
}

resource "google_project_iam_binding" "common-dns-admin" {
  project = "${google_project.common.id}"
  role = "roles/dns.admin"
  members = [
      "serviceAccount:${google_service_account.ci-terraformer.email}"
  ]
}

resource "google_project_services" "common-services" {
  project = "${google_project.common.id}"
  services = [
    # Sure we need them
    "cloudresourcemanager.googleapis.com",
    "cloudbilling.googleapis.com",
    "iam.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",

    # Enabled via UI
    "bigquery-json.googleapis.com",
    "clouddebugger.googleapis.com",
    "datastore.googleapis.com",
    "storage-component.googleapis.com",
    "pubsub.googleapis.com",
    "container.googleapis.com",
    "storage-api.googleapis.com",
    "distance-matrix-backend.googleapis.com",
    "logging.googleapis.com",
    "elevation-backend.googleapis.com",
    "places-backend.googleapis.com",
    "resourceviews.googleapis.com",
    "replicapool.googleapis.com",
    "cloudapis.googleapis.com",
    "sourcerepo.googleapis.com",
    "deploymentmanager.googleapis.com",
    "directions-backend.googleapis.com",
    "containerregistry.googleapis.com",
    "monitoring.googleapis.com",
    "maps-embed-backend.googleapis.com",
    "sqladmin.googleapis.com",
    "sql-component.googleapis.com",
    "maps-backend.googleapis.com",
    "cloudtrace.googleapis.com",
    "servicemanagement.googleapis.com",
    "geocoding-backend.googleapis.com",
    "replicapoolupdater.googleapis.com",
    "cloudbuild.googleapis.com"
  ]
}

# This is automatically created by the container registry.
# resource "google_storage_bucket" "container-registry-backing" {
#   name = "eu.artifacts.chm-sqrt2-retrofeed-common.appspot.com"
#   project = "${google_project.common.id}"
#   storage_class = "MULTI_REGIONAL"
#   location = "eu"
# }

# resource "google_storage_bucket_iam_binding" "container-registry-backing" {
#   bucket = "eu.artifacts.chm-sqrt2-retrofeed-common.appspot.com"
#   role = "roles/iam.roleAdmin"
#   members = [
#       "serviceAccount:${google_service_account.ci-terraformer.email}"
#   ]
# }
