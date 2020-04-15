<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200415132051 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team_ronvau ADD competition_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE team_ronvau ADD CONSTRAINT FK_4D5DE1AB7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4D5DE1AB7B39D312 ON team_ronvau (competition_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team_ronvau DROP FOREIGN KEY FK_4D5DE1AB7B39D312');
        $this->addSql('DROP INDEX UNIQ_4D5DE1AB7B39D312 ON team_ronvau');
        $this->addSql('ALTER TABLE team_ronvau DROP competition_id');
    }
}
