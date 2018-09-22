resource "google_project" "local" {
  name = "Env - Local"
  project_id = "chm-sqrt2-retrofeed-local"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"
}

resource "google_project_services" "local-services" {
  project = "${google_project.local.id}"
  services = []
}
