<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200521220403 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_team_event (user_team_id INT NOT NULL, event_team_id INT NOT NULL, INDEX IDX_5BCF850B7161C6A4 (user_team_id), INDEX IDX_5BCF850BAC3B7101 (event_team_id), UNIQUE INDEX user_team_event_unique (user_team_id, event_team_id), PRIMARY KEY(user_team_id, event_team_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_team_event ADD CONSTRAINT FK_5BCF850B7161C6A4 FOREIGN KEY (user_team_id) REFERENCES user_team (id)');
        $this->addSql('ALTER TABLE user_team_event ADD CONSTRAINT FK_5BCF850BAC3B7101 FOREIGN KEY (event_team_id) REFERENCES events_team (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE user_team_event');
    }
}
