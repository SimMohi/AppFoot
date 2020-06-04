<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200604003838 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_unofficial_match MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE player_unofficial_match DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE player_unofficial_match DROP id');
        $this->addSql('CREATE UNIQUE INDEX un_official_match_unique ON player_unofficial_match (user_team_id, un_official_match_id)');
        $this->addSql('ALTER TABLE player_unofficial_match ADD PRIMARY KEY (user_team_id, un_official_match_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX un_official_match_unique ON player_unofficial_match');
        $this->addSql('ALTER TABLE player_unofficial_match ADD id INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
    }
}
