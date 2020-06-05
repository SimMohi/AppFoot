<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200604232008 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB171179CD6');
        $this->addSql('DROP TABLE name_competition');
        $this->addSql('DROP INDEX competition_unique ON competition');
        $this->addSql('DROP INDEX IDX_B50A2CB171179CD6 ON competition');
        $this->addSql('ALTER TABLE competition ADD name VARCHAR(255) NOT NULL, DROP name_id, DROP match_day_number');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE name_competition (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE competition ADD name_id INT DEFAULT NULL, ADD match_day_number INT NOT NULL, DROP name');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB171179CD6 FOREIGN KEY (name_id) REFERENCES name_competition (id)');
        $this->addSql('CREATE UNIQUE INDEX competition_unique ON competition (season, name_id)');
        $this->addSql('CREATE INDEX IDX_B50A2CB171179CD6 ON competition (name_id)');
    }
}
