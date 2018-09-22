resource "google_project" "test" {
  name = "Env - Test"
  project_id = "chm-sqrt2-retrofeed-test"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"
}

resource "google_project_services" "test-services" {
  project = "${google_project.test.id}"
  services = []
}
