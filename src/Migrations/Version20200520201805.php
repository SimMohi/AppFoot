<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200520201805 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP INDEX UNIQ_8D93D649F5B7AF75, ADD INDEX IDX_8D93D649F5B7AF75 (address_id)');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61FF5B7AF75');
        $this->addSql('DROP INDEX UNIQ_C4E0A61FF5B7AF75 ON team');
        $this->addSql('ALTER TABLE team DROP address_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team ADD address_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61FF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C4E0A61FF5B7AF75 ON team (address_id)');
        $this->addSql('ALTER TABLE user DROP INDEX IDX_8D93D649F5B7AF75, ADD UNIQUE INDEX UNIQ_8D93D649F5B7AF75 (address_id)');
    }
}
