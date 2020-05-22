<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200521162747 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE un_official_match (id INT AUTO_INCREMENT NOT NULL, team_ronvau_id INT NOT NULL, opponent_id INT NOT NULL, ronvau_team_goal INT DEFAULT NULL, opponent_goal INT DEFAULT NULL, date DATETIME NOT NULL, is_home TINYINT(1) NOT NULL, INDEX IDX_D96856CAE1D39818 (team_ronvau_id), INDEX IDX_D96856CA7F656CDC (opponent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE un_official_match ADD CONSTRAINT FK_D96856CAE1D39818 FOREIGN KEY (team_ronvau_id) REFERENCES team_ronvau (id)');
        $this->addSql('ALTER TABLE un_official_match ADD CONSTRAINT FK_D96856CA7F656CDC FOREIGN KEY (opponent_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE team DROP won, DROP drawn, DROP lost');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE un_official_match');
        $this->addSql('ALTER TABLE team ADD won INT DEFAULT 0, ADD drawn INT DEFAULT 0, ADD lost INT DEFAULT 0');
    }
}
