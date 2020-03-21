<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200319223003 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F61190A32');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F7B39D312');
        $this->addSql('DROP INDEX IDX_C4E0A61F7B39D312 ON team');
        $this->addSql('DROP INDEX IDX_C4E0A61F61190A32 ON team');
        $this->addSql('ALTER TABLE team ADD id_club_id INT NOT NULL, ADD id_competition_id INT NOT NULL, DROP club_id, DROP competition_id');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61FBF84A342 FOREIGN KEY (id_club_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F465F6E14 FOREIGN KEY (id_competition_id) REFERENCES competition (id)');
        $this->addSql('CREATE INDEX IDX_C4E0A61FBF84A342 ON team (id_club_id)');
        $this->addSql('CREATE INDEX IDX_C4E0A61F465F6E14 ON team (id_competition_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61FBF84A342');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F465F6E14');
        $this->addSql('DROP INDEX IDX_C4E0A61FBF84A342 ON team');
        $this->addSql('DROP INDEX IDX_C4E0A61F465F6E14 ON team');
        $this->addSql('ALTER TABLE team ADD club_id INT NOT NULL, ADD competition_id INT NOT NULL, DROP id_club_id, DROP id_competition_id');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F61190A32 FOREIGN KEY (club_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('CREATE INDEX IDX_C4E0A61F7B39D312 ON team (competition_id)');
        $this->addSql('CREATE INDEX IDX_C4E0A61F61190A32 ON team (club_id)');
    }
}
