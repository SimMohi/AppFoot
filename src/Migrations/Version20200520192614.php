<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200520192614 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64928884CB9');
        $this->addSql('CREATE TABLE test (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('DROP TABLE new_address');
        $this->addSql('ALTER TABLE team_ronvau ADD test_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE team_ronvau ADD CONSTRAINT FK_4D5DE1AB1E5D0459 FOREIGN KEY (test_id) REFERENCES test (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4D5DE1AB1E5D0459 ON team_ronvau (test_id)');
        $this->addSql('DROP INDEX UNIQ_8D93D64928884CB9 ON user');
        $this->addSql('ALTER TABLE user DROP new_address_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team_ronvau DROP FOREIGN KEY FK_4D5DE1AB1E5D0459');
        $this->addSql('CREATE TABLE new_address (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE test');
        $this->addSql('DROP INDEX UNIQ_4D5DE1AB1E5D0459 ON team_ronvau');
        $this->addSql('ALTER TABLE team_ronvau DROP test_id');
        $this->addSql('ALTER TABLE user ADD new_address_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64928884CB9 FOREIGN KEY (new_address_id) REFERENCES new_address (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64928884CB9 ON user (new_address_id)');
    }
}
