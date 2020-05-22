<?php

namespace App\Repository;

use App\Entity\UserTeamEvent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserTeamEvent|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserTeamEvent|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserTeamEvent[]    findAll()
 * @method UserTeamEvent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserTeamEventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserTeamEvent::class);
    }

    // /**
    //  * @return UserTeamEvent[] Returns an array of UserTeamEvent objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserTeamEvent
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
