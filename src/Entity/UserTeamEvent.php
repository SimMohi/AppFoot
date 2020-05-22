<?php

namespace App\Entity;

use App\Repository\UserTeamEventRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Table(name="user_team_event", uniqueConstraints={
 *     @UniqueConstraint(name="user_team_event_unique",
 *         columns={"user_team_id", "event_team_id"})
 *     }
 * )
 * @ORM\Entity(repositoryClass=UserTeamEventRepository::class)
 * @UniqueEntity(fields={"userTeam", "eventTeam"}, message="Vous êtes déjà inscrit à cet événement")
 * @ApiResource
 */
class UserTeamEvent
{

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity=UserTeam::class, inversedBy="userTeamEvents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $userTeam;

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity=EventsTeam::class, inversedBy="userTeamEvents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $eventTeam;

    public function getUserTeam(): ?UserTeam
    {
        return $this->userTeam;
    }

    public function setUserTeam(?UserTeam $userTeam): self
    {
        $this->userTeam = $userTeam;

        return $this;
    }

    public function getEventTeam(): ?EventsTeam
    {
        return $this->eventTeam;
    }

    public function setEventTeam(?EventsTeam $eventTeam): self
    {
        $this->eventTeam = $eventTeam;

        return $this;
    }
}
