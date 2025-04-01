provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr = "10.0.0.0/16"
  environment = var.environment
  
  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]
  
  private_subnets = [
    "10.0.10.0/24",
    "10.0.11.0/24"
  ]
}

module "ecs" {
  source = "./modules/ecs"
  
  cluster_name = "internetcafe-${var.environment}"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  
  app_image = var.app_image
  app_count = 2
  app_port = 3000
  
  environment_variables = {
    NODE_ENV = var.environment
    DB_HOST = module.rds.endpoint
    REDIS_HOST = module.elasticache.endpoint
  }
}

module "rds" {
  source = "./modules/rds"
  
  identifier = "internetcafe-${var.environment}"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  
  engine = "postgres"
  engine_version = "14"
  instance_class = "db.t3.medium"
  
  database_name = "internetcafe"
  master_username = var.db_username
  master_password = var.db_password
} 