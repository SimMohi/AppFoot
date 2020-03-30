<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200330203118 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE events_team (id INT AUTO_INCREMENT NOT NULL, id_team_ronvau_id INT NOT NULL, id_events_id INT NOT NULL, INDEX IDX_A8B0A265DCB5251E (id_team_ronvau_id), INDEX IDX_A8B0A2651D5FAC42 (id_events_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE matche (id INT AUTO_INCREMENT NOT NULL, home_team_id INT NOT NULL, visitor_team_id INT NOT NULL, home_team_goal INT DEFAULT NULL, visitor_team_goal INT DEFAULT NULL, date DATETIME DEFAULT NULL, match_day INT DEFAULT NULL, INDEX IDX_9FCAD5109C4C13F6 (home_team_id), INDEX IDX_9FCAD510EB7F4866 (visitor_team_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE player_match (id INT AUTO_INCREMENT NOT NULL, id_match_id INT DEFAULT NULL, id_user_team_id INT NOT NULL, played INT NOT NULL, goal INT NOT NULL, yellow_card INT NOT NULL, red_card INT NOT NULL, has_confirmed TINYINT(1) NOT NULL, INDEX IDX_C529BE437A654043 (id_match_id), INDEX IDX_C529BE4352A0B3D6 (id_user_team_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE team_ronvau (id INT AUTO_INCREMENT NOT NULL, category VARCHAR(255) NOT NULL, coach VARCHAR(255) DEFAULT NULL, coach_phone VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE car_passenger (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, car_id INT NOT NULL, INDEX IDX_3C0D1AF1A76ED395 (user_id), INDEX IDX_3C0D1AF1C3C6F69F (car_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE club (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, logo VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE events (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE player_of_the_match (id INT AUTO_INCREMENT NOT NULL, id_user_id INT NOT NULL, id_player_match_id INT DEFAULT NULL, INDEX IDX_673E262579F37AE5 (id_user_id), INDEX IDX_673E2625C5372EBE (id_player_match_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_team (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, team_ronvau_id_id INT NOT NULL, is_staff TINYINT(1) NOT NULL, is_player TINYINT(1) NOT NULL, INDEX IDX_BE61EAD69D86650F (user_id_id), INDEX IDX_BE61EAD6D236B465 (team_ronvau_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE competition (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, season VARCHAR(255) NOT NULL, format VARCHAR(255) NOT NULL, match_day_number INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE car (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, place_remaining INT NOT NULL, date DATETIME NOT NULL, departure_place VARCHAR(255) NOT NULL, INDEX IDX_773DE69D9D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, gsm VARCHAR(255) DEFAULT NULL, profile_pic VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE team (id INT AUTO_INCREMENT NOT NULL, club_id INT NOT NULL, competition_id INT NOT NULL, won INT DEFAULT 0, drawn INT DEFAULT 0, lost INT DEFAULT 0, INDEX IDX_C4E0A61F61190A32 (club_id), INDEX IDX_C4E0A61F7B39D312 (competition_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE player_training (id INT AUTO_INCREMENT NOT NULL, id_user_team_id INT DEFAULT NULL, id_training_id INT NOT NULL, has_comfirmed TINYINT(1) NOT NULL, absence_justification VARCHAR(255) DEFAULT NULL, INDEX IDX_D3C5CB6F52A0B3D6 (id_user_team_id), INDEX IDX_D3C5CB6FA6EF5526 (id_training_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE training (id INT AUTO_INCREMENT NOT NULL, team_ronvau_id INT NOT NULL, date DATETIME NOT NULL, INDEX IDX_D5128A8FE1D39818 (team_ronvau_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE events_team ADD CONSTRAINT FK_A8B0A265DCB5251E FOREIGN KEY (id_team_ronvau_id) REFERENCES team_ronvau (id)');
        $this->addSql('ALTER TABLE events_team ADD CONSTRAINT FK_A8B0A2651D5FAC42 FOREIGN KEY (id_events_id) REFERENCES events (id)');
        $this->addSql('ALTER TABLE matche ADD CONSTRAINT FK_9FCAD5109C4C13F6 FOREIGN KEY (home_team_id) REFERENCES team (id)');
        $this->addSql('ALTER TABLE matche ADD CONSTRAINT FK_9FCAD510EB7F4866 FOREIGN KEY (visitor_team_id) REFERENCES team (id)');
        $this->addSql('ALTER TABLE player_match ADD CONSTRAINT FK_C529BE437A654043 FOREIGN KEY (id_match_id) REFERENCES matche (id)');
        $this->addSql('ALTER TABLE player_match ADD CONSTRAINT FK_C529BE4352A0B3D6 FOREIGN KEY (id_user_team_id) REFERENCES user_team (id)');
        $this->addSql('ALTER TABLE car_passenger ADD CONSTRAINT FK_3C0D1AF1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE car_passenger ADD CONSTRAINT FK_3C0D1AF1C3C6F69F FOREIGN KEY (car_id) REFERENCES car (id)');
        $this->addSql('ALTER TABLE player_of_the_match ADD CONSTRAINT FK_673E262579F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE player_of_the_match ADD CONSTRAINT FK_673E2625C5372EBE FOREIGN KEY (id_player_match_id) REFERENCES player_match (id)');
        $this->addSql('ALTER TABLE user_team ADD CONSTRAINT FK_BE61EAD69D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_team ADD CONSTRAINT FK_BE61EAD6D236B465 FOREIGN KEY (team_ronvau_id_id) REFERENCES team_ronvau (id)');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F61190A32 FOREIGN KEY (club_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE player_training ADD CONSTRAINT FK_D3C5CB6F52A0B3D6 FOREIGN KEY (id_user_team_id) REFERENCES user_team (id)');
        $this->addSql('ALTER TABLE player_training ADD CONSTRAINT FK_D3C5CB6FA6EF5526 FOREIGN KEY (id_training_id) REFERENCES training (id)');
        $this->addSql('ALTER TABLE training ADD CONSTRAINT FK_D5128A8FE1D39818 FOREIGN KEY (team_ronvau_id) REFERENCES team_ronvau (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_match DROP FOREIGN KEY FK_C529BE437A654043');
        $this->addSql('ALTER TABLE player_of_the_match DROP FOREIGN KEY FK_673E2625C5372EBE');
        $this->addSql('ALTER TABLE events_team DROP FOREIGN KEY FK_A8B0A265DCB5251E');
        $this->addSql('ALTER TABLE user_team DROP FOREIGN KEY FK_BE61EAD6D236B465');
        $this->addSql('ALTER TABLE training DROP FOREIGN KEY FK_D5128A8FE1D39818');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F61190A32');
        $this->addSql('ALTER TABLE events_team DROP FOREIGN KEY FK_A8B0A2651D5FAC42');
        $this->addSql('ALTER TABLE player_match DROP FOREIGN KEY FK_C529BE4352A0B3D6');
        $this->addSql('ALTER TABLE player_training DROP FOREIGN KEY FK_D3C5CB6F52A0B3D6');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F7B39D312');
        $this->addSql('ALTER TABLE car_passenger DROP FOREIGN KEY FK_3C0D1AF1C3C6F69F');
        $this->addSql('ALTER TABLE car_passenger DROP FOREIGN KEY FK_3C0D1AF1A76ED395');
        $this->addSql('ALTER TABLE player_of_the_match DROP FOREIGN KEY FK_673E262579F37AE5');
        $this->addSql('ALTER TABLE user_team DROP FOREIGN KEY FK_BE61EAD69D86650F');
        $this->addSql('ALTER TABLE car DROP FOREIGN KEY FK_773DE69D9D86650F');
        $this->addSql('ALTER TABLE matche DROP FOREIGN KEY FK_9FCAD5109C4C13F6');
        $this->addSql('ALTER TABLE matche DROP FOREIGN KEY FK_9FCAD510EB7F4866');
        $this->addSql('ALTER TABLE player_training DROP FOREIGN KEY FK_D3C5CB6FA6EF5526');
        $this->addSql('DROP TABLE events_team');
        $this->addSql('DROP TABLE matche');
        $this->addSql('DROP TABLE player_match');
        $this->addSql('DROP TABLE team_ronvau');
        $this->addSql('DROP TABLE car_passenger');
        $this->addSql('DROP TABLE club');
        $this->addSql('DROP TABLE events');
        $this->addSql('DROP TABLE player_of_the_match');
        $this->addSql('DROP TABLE user_team');
        $this->addSql('DROP TABLE competition');
        $this->addSql('DROP TABLE car');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE team');
        $this->addSql('DROP TABLE player_training');
        $this->addSql('DROP TABLE training');
    }
}
