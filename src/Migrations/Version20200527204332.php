<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200527204332 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE car_passenger ADD address_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE car_passenger ADD CONSTRAINT FK_3C0D1AF1F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('CREATE INDEX IDX_3C0D1AF1F5B7AF75 ON car_passenger (address_id)');
        $this->addSql('ALTER TABLE car ADD title VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D2B1957E1 FOREIGN KEY (departure_address_id) REFERENCES address (id)');
        $this->addSql('CREATE INDEX IDX_773DE69D2B1957E1 ON car (departure_address_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE car DROP FOREIGN KEY FK_773DE69D2B1957E1');
        $this->addSql('DROP INDEX IDX_773DE69D2B1957E1 ON car');
        $this->addSql('ALTER TABLE car DROP title');
        $this->addSql('ALTER TABLE car_passenger DROP FOREIGN KEY FK_3C0D1AF1F5B7AF75');
        $this->addSql('DROP INDEX IDX_3C0D1AF1F5B7AF75 ON car_passenger');
        $this->addSql('ALTER TABLE car_passenger DROP address_id');
    }
}
