<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200522095443 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE car_passenger MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE car_passenger DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE car_passenger DROP id');
        $this->addSql('CREATE UNIQUE INDEX car_passenger_unique ON car_passenger (user_id, car_id)');
        $this->addSql('ALTER TABLE car_passenger ADD PRIMARY KEY (user_id, car_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX car_passenger_unique ON car_passenger');
        $this->addSql('ALTER TABLE car_passenger ADD id INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
    }
}
