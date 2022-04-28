-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema grader
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `grader` ;

-- -----------------------------------------------------
-- Schema grader
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `grader` DEFAULT CHARACTER SET utf8 ;
USE `grader` ;

-- -----------------------------------------------------
-- Table `grader`.`task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`task` ;

CREATE TABLE IF NOT EXISTS `grader`.`task` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `statement` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`testgrouptype`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`testgrouptype` ;

CREATE TABLE IF NOT EXISTS `grader`.`testgrouptype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `type_UNIQUE` (`type` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`testgroup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`testgroup` ;

CREATE TABLE IF NOT EXISTS `grader`.`testgroup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `testgrouptype_id` INT NOT NULL,
  `task_id` INT NOT NULL,
  `points` INT NOT NULL,
  `timelimit` INT NOT NULL,
  `limits` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testgroup_testgrouptype_idx` (`testgrouptype_id` ASC) VISIBLE,
  INDEX `fk_testgroup_task1_idx` (`task_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_testgroup_testgrouptype`
    FOREIGN KEY (`testgrouptype_id`)
    REFERENCES `grader`.`testgrouptype` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testgroup_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `grader`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`testcase`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`testcase` ;

CREATE TABLE IF NOT EXISTS `grader`.`testcase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `input` MEDIUMTEXT NOT NULL,
  `output` MEDIUMTEXT NOT NULL,
  `testgroup_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testcase_testgroup1_idx` (`testgroup_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_testcase_testgroup1`
    FOREIGN KEY (`testgroup_id`)
    REFERENCES `grader`.`testgroup` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`user` ;

CREATE TABLE IF NOT EXISTS `grader`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`status` ;

CREATE TABLE IF NOT EXISTS `grader`.`status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `status_UNIQUE` (`status` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`submission`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`submission` ;

CREATE TABLE IF NOT EXISTS `grader`.`submission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `task_id` INT NOT NULL,
  `verdict` INT NOT NULL,
  `time` TIMESTAMP NOT NULL,
  `compilation_status` INT NOT NULL,
  `compilation_text` TEXT NOT NULL,
  `code` MEDIUMTEXT NOT NULL,
  `score` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_submission_status1_idx` (`compilation_status` ASC) VISIBLE,
  INDEX `fk_submission_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_submission_task1_idx` (`task_id` ASC) VISIBLE,
  INDEX `fk_submission_status2_idx` (`verdict` ASC) VISIBLE,
  CONSTRAINT `fk_submission_status1`
    FOREIGN KEY (`compilation_status`)
    REFERENCES `grader`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submission_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `grader`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submission_task1`
    FOREIGN KEY (`task_id`)
    REFERENCES `grader`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submission_status2`
    FOREIGN KEY (`verdict`)
    REFERENCES `grader`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`testcase_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`testcase_status` ;

CREATE TABLE IF NOT EXISTS `grader`.`testcase_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status_id` INT NOT NULL,
  `testcase_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  `output` MEDIUMTEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_testcase_status_status1_idx` (`status_id` ASC) VISIBLE,
  INDEX `fk_testcase_status_testcase1_idx` (`testcase_id` ASC) VISIBLE,
  INDEX `fk_testcase_status_submission1_idx` (`submission_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_testcase_status_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `grader`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testcase_status_testcase1`
    FOREIGN KEY (`testcase_id`)
    REFERENCES `grader`.`testcase` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_testcase_status_submission1`
    FOREIGN KEY (`submission_id`)
    REFERENCES `grader`.`submission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`role` ;

CREATE TABLE IF NOT EXISTS `grader`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `role_UNIQUE` (`role` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grader`.`user_has_role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `grader`.`user_has_role` ;

CREATE TABLE IF NOT EXISTS `grader`.`user_has_role` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  INDEX `fk_user_has_role_role1_idx` (`role_id` ASC) VISIBLE,
  INDEX `fk_user_has_role_user1_idx` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `role_id_UNIQUE` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_role_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `grader`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_role_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `grader`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
