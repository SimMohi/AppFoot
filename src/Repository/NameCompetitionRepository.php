<?php

namespace App\Repository;

use App\Entity\NameCompetition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method NameCompetition|null find($id, $lockMode = null, $lockVersion = null)
 * @method NameCompetition|null findOneBy(array $criteria, array $orderBy = null)
 * @method NameCompetition[]    findAll()
 * @method NameCompetition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NameCompetitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NameCompetition::class);
    }

    // /**
    //  * @return NameCompetition[] Returns an array of NameCompetition objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?NameCompetition
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
