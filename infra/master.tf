# Most of the stuff in here has actually been created by hand when
# doing an initial setup of GCE. Resources _can_ be created when only
# the relevant pieces of data are present, but in reality, that's not
# what happened. I creted everything by hand and then added enough
# resources to mirror my handy-work. You'll thank me later for the pun.

provider "google" {
  # NOTE: Only uncomment when importing the domain.
  # project = "chm-sqrt2-shared"
  # No credentials here. Needs to run as horia@ with default credentials
  # from "gcloud auth application-default login"
}

# Everything here needs to be created beforehand and then imported

data "google_organization" "chm-sqrt2" {
  domain = "chm-sqrt2.com"
}

data "google_billing_account" "retrofeed" {
  display_name = "RetroFeed"
  open = true
}

data "google_billing_account" "shared" {
  display_name = "Shared"
  open = true
}

resource "google_folder" "retrofeed" {
  display_name = "RetroFeed"
  parent = "${data.google_organization.chm-sqrt2.name}"
}

resource "google_project" "common" {
  name = "Common"
  project_id = "chm-sqrt2-retrofeed-common"
  folder_id = "${google_folder.retrofeed.id}"
  billing_account = "${data.google_billing_account.retrofeed.id}"
}

resource "google_project" "shared" {
  name = "Shared"
  project_id = "chm-sqrt2-shared"
  billing_account = "${data.google_billing_account.shared.id}"
}

resource "google_storage_bucket" "terraform" {
  name = "chm-sqrt2-retrofeed-common-terraform"
  project = "${google_project.common.id}"
  storage_class = "MULTI_REGIONAL"
  location = "eu"
  versioning = {
    enabled = true
  }
}

resource "google_dns_managed_zone" "domain" {
  project = "${google_project.shared.id}"

  name = "chm-sqrt2-io"
  description = "Infrastructure domain"

  dns_name = "chm-sqrt2.io."
}
