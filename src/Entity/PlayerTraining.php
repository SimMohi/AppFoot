<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;



/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerTrainingRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"player_trainings_read"}},
 * )
 * @ApiFilter(SearchFilter::class , properties={"idTraining": "exact"})
 * @ApiFilter(BooleanFilter::class, properties={"isAbsent"})
 */
class PlayerTraining
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"player_trainings_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserTeam", inversedBy="playerTrainings")
     * @Groups({"player_trainings_read"})
     */
    private $idUserTeam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Training", inversedBy="playerTrainings")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"player_trainings_read"})
     */
    private $idTraining;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"player_trainings_read"})
     */
    private $wasPresent;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"player_trainings_read"})
     */
    private $absenceJustification;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"player_trainings_read"})
     */
    private $isAbsent;

    public function __construct()
    {
        $this->isAbsent = false;
        $this->wasPresent = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUserTeam(): ?UserTeam
    {
        return $this->idUserTeam;
    }

    public function setIdUserTeam(?UserTeam $idUserTeam): self
    {
        $this->idUserTeam = $idUserTeam;

        return $this;
    }

    public function getIdTraining(): ?Training
    {
        return $this->idTraining;
    }

    public function setIdTraining(?Training $idTraining): self
    {
        $this->idTraining = $idTraining;

        return $this;
    }

    public function getWasPresent(): ?bool
    {
        return $this->wasPresent;
    }

    public function setWasPresent(bool $wasPresent): self
    {
        $this->wasPresent = $wasPresent;

        return $this;
    }

    public function getAbsenceJustification(): ?string
    {
        return $this->absenceJustification;
    }

    public function setAbsenceJustification(?string $absenceJustification): self
    {
        $this->absenceJustification = $absenceJustification;

        return $this;
    }

    public function getIsAbsent(): ?bool
    {
        return $this->isAbsent;
    }

    public function setIsAbsent(bool $isAbsent): self
    {
        $this->isAbsent = $isAbsent;

        return $this;
    }
}
