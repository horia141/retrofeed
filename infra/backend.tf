terraform {
  backend "gcs" {
    bucket = "chm-sqrt2-retrofeed-common-terraform"
    prefix = "state/boot"
  }
}
