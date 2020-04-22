<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200422094442 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_match CHANGE played played TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE team_ronvau ADD CONSTRAINT FK_4D5DE1AB296CD8AE FOREIGN KEY (team_id) REFERENCES team (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4D5DE1AB296CD8AE ON team_ronvau (team_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_match CHANGE played played INT NOT NULL');
        $this->addSql('ALTER TABLE team_ronvau DROP FOREIGN KEY FK_4D5DE1AB296CD8AE');
        $this->addSql('DROP INDEX UNIQ_4D5DE1AB296CD8AE ON team_ronvau');
    }
}
