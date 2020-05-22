<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200521184633 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE player_unofficial_match (id INT AUTO_INCREMENT NOT NULL, user_team_id INT NOT NULL, un_official_match_id INT NOT NULL, played TINYINT(1) DEFAULT NULL, goal INT DEFAULT NULL, yellow_card INT DEFAULT NULL, red_car INT DEFAULT NULL, has_confirmed TINYINT(1) NOT NULL, has_refused TINYINT(1) NOT NULL, refused_justification LONGTEXT DEFAULT NULL, INDEX IDX_4451235C7161C6A4 (user_team_id), INDEX IDX_4451235C55F1C5C7 (un_official_match_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE player_unofficial_match ADD CONSTRAINT FK_4451235C7161C6A4 FOREIGN KEY (user_team_id) REFERENCES user_team (id)');
        $this->addSql('ALTER TABLE player_unofficial_match ADD CONSTRAINT FK_4451235C55F1C5C7 FOREIGN KEY (un_official_match_id) REFERENCES un_official_match (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE player_unofficial_match');
    }
}
