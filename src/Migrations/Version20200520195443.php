<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200520195443 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team_ronvau DROP FOREIGN KEY FK_4D5DE1AB1E5D0459');
        $this->addSql('DROP INDEX UNIQ_4D5DE1AB1E5D0459 ON team_ronvau');
        $this->addSql('ALTER TABLE team_ronvau DROP test_id');
        $this->addSql('ALTER TABLE test ADD test_id INT DEFAULT NULL, DROP name');
        $this->addSql('ALTER TABLE test ADD CONSTRAINT FK_D87F7E0C1E5D0459 FOREIGN KEY (test_id) REFERENCES team (id)');
        $this->addSql('CREATE INDEX IDX_D87F7E0C1E5D0459 ON test (test_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team_ronvau ADD test_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE team_ronvau ADD CONSTRAINT FK_4D5DE1AB1E5D0459 FOREIGN KEY (test_id) REFERENCES test (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4D5DE1AB1E5D0459 ON team_ronvau (test_id)');
        $this->addSql('ALTER TABLE test DROP FOREIGN KEY FK_D87F7E0C1E5D0459');
        $this->addSql('DROP INDEX IDX_D87F7E0C1E5D0459 ON test');
        $this->addSql('ALTER TABLE test ADD name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, DROP test_id');
    }
}
