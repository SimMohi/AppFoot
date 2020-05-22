<?php

namespace App\Repository;

use App\Entity\PlayerUnofficialMatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PlayerUnofficialMatch|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlayerUnofficialMatch|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlayerUnofficialMatch[]    findAll()
 * @method PlayerUnofficialMatch[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlayerUnofficialMatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlayerUnofficialMatch::class);
    }

    // /**
    //  * @return PlayerUnofficialMatch[] Returns an array of PlayerUnofficialMatch objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PlayerUnofficialMatch
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
