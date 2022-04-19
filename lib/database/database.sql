-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`task` ;

CREATE TABLE IF NOT EXISTS `mydb`.`task` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `statement` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`testgrouptype`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`testgrouptype` ;

CREATE TABLE IF NOT EXISTS `mydb`.`testgrouptype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `type_UNIQUE` (`type` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`testgroup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`testgroup` ;

CREATE TABLE IF NOT EXISTS `mydb`.`testgroup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `testgrouptype_id` INT NOT NULL,
  `task_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testgroup_testgrouptype_idx` (`testgrouptype_id` ASC) VISIBLE,
  INDEX `fk_testgroup_task1_idx` (`task_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_testgroup_testgrouptype`
    FOREIGN KEY (`testgrouptype_id`)
    REFERENCES `mydb`.`testgrouptype` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testgroup_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `mydb`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`testcase`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`testcase` ;

CREATE TABLE IF NOT EXISTS `mydb`.`testcase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `input` MEDIUMTEXT NULL,
  `output` MEDIUMTEXT NULL,
  `testgroup_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testcase_testgroup1_idx` (`testgroup_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_testcase_testgroup1`
    FOREIGN KEY (`testgroup_id`)
    REFERENCES `mydb`.`testgroup` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`user` ;

CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`status` ;

CREATE TABLE IF NOT EXISTS `mydb`.`status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `status_UNIQUE` (`status` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`submission`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`submission` ;

CREATE TABLE IF NOT EXISTS `mydb`.`submission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `compilation` INT NOT NULL,
  `user_id` INT NOT NULL,
  `code` MEDIUMTEXT NULL,
  `task_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_submission_status1_idx` (`compilation` ASC) VISIBLE,
  INDEX `fk_submission_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_submission_task1_idx` (`task_id` ASC) VISIBLE,
  CONSTRAINT `fk_submission_status1`
    FOREIGN KEY (`compilation`)
    REFERENCES `mydb`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submission_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submission_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `mydb`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`testcase_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`testcase_status` ;

CREATE TABLE IF NOT EXISTS `mydb`.`testcase_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status_id` INT NOT NULL,
  `testcase_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testcase_status_status1_idx` (`status_id` ASC) VISIBLE,
  INDEX `fk_testcase_status_testcase1_idx` (`testcase_id` ASC) VISIBLE,
  INDEX `fk_testcase_status_submission1_idx` (`submission_id` ASC) VISIBLE,
  CONSTRAINT `fk_testcase_status_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `mydb`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testcase_status_testcase1`
    FOREIGN KEY (`testcase_id`)
    REFERENCES `mydb`.`testcase` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testcase_status_submission1`
    FOREIGN KEY (`submission_id`)
    REFERENCES `mydb`.`submission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
