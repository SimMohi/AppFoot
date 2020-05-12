<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200511143849 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_of_the_match DROP FOREIGN KEY FK_673E262579F37AE5');
        $this->addSql('DROP INDEX IDX_673E262579F37AE5 ON player_of_the_match');
        $this->addSql('ALTER TABLE player_of_the_match CHANGE id_user_id user_team_id INT NOT NULL');
        $this->addSql('ALTER TABLE player_of_the_match ADD CONSTRAINT FK_673E26257161C6A4 FOREIGN KEY (user_team_id) REFERENCES user_team (id)');
        $this->addSql('CREATE INDEX IDX_673E26257161C6A4 ON player_of_the_match (user_team_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE player_of_the_match DROP FOREIGN KEY FK_673E26257161C6A4');
        $this->addSql('DROP INDEX IDX_673E26257161C6A4 ON player_of_the_match');
        $this->addSql('ALTER TABLE player_of_the_match CHANGE user_team_id id_user_id INT NOT NULL');
        $this->addSql('ALTER TABLE player_of_the_match ADD CONSTRAINT FK_673E262579F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_673E262579F37AE5 ON player_of_the_match (id_user_id)');
    }
}
