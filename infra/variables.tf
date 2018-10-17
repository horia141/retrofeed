variable "staging_region" {
  type = "string"
  default = "europe-west3"
}
variable "staging_region_and_zone" {
  type = "string"
  default = "europe-west3-a"
}
variable "staging_sqldb_main_user_core_password" {
  type = "string"
}
variable "staging_external_host" {
  type = "string"
  default = "staging.retrofeed.chm-sqrt2.io"
}
variable "live_region" {
  type = "string"
  default = "europe-west3"
}
variable "live_region_and_zone" {
  type = "string"
  default = "europe-west3-a"
}
variable "live_sqldb_main_user_core_password" {
  type = "string"
}
variable "live_external_host" {
  type = "string"
  default = "retrofeed.io"
}
variable "core_http_port" {
  type = "string"
  default = "10000"
}
variable "core_health_check_path" {
  type = "string"
  default = "/real/tech/status"
}
