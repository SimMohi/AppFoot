<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200605221928 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_team_event DROP FOREIGN KEY FK_5BCF850BAC3B7101');
        $this->addSql('DROP INDEX user_team_event_unique ON user_team_event');
        $this->addSql('DROP INDEX IDX_5BCF850BAC3B7101 ON user_team_event');
        $this->addSql('ALTER TABLE user_team_event DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE user_team_event CHANGE event_team_id event_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_team_event ADD CONSTRAINT FK_5BCF850B71F7E88B FOREIGN KEY (event_id) REFERENCES event (id)');
        $this->addSql('CREATE INDEX IDX_5BCF850B71F7E88B ON user_team_event (event_id)');
        $this->addSql('ALTER TABLE user_team_event ADD PRIMARY KEY (user_team_id, event_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_team_event DROP FOREIGN KEY FK_5BCF850B71F7E88B');
        $this->addSql('DROP INDEX IDX_5BCF850B71F7E88B ON user_team_event');
        $this->addSql('ALTER TABLE user_team_event DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE user_team_event CHANGE event_id event_team_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_team_event ADD CONSTRAINT FK_5BCF850BAC3B7101 FOREIGN KEY (event_team_id) REFERENCES events_team (id)');
        $this->addSql('CREATE UNIQUE INDEX user_team_event_unique ON user_team_event (user_team_id, event_team_id)');
        $this->addSql('CREATE INDEX IDX_5BCF850BAC3B7101 ON user_team_event (event_team_id)');
        $this->addSql('ALTER TABLE user_team_event ADD PRIMARY KEY (user_team_id, event_team_id)');
    }
}
