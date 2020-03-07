<?php

namespace App\Repository;

use App\Entity\EventsTeam;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method EventsTeam|null find($id, $lockMode = null, $lockVersion = null)
 * @method EventsTeam|null findOneBy(array $criteria, array $orderBy = null)
 * @method EventsTeam[]    findAll()
 * @method EventsTeam[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventsTeamRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventsTeam::class);
    }

    // /**
    //  * @return EventsTeam[] Returns an array of EventsTeam objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?EventsTeam
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
