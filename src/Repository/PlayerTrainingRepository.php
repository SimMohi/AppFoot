<?php

namespace App\Repository;

use App\Entity\PlayerTraining;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method PlayerTraining|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlayerTraining|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlayerTraining[]    findAll()
 * @method PlayerTraining[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlayerTrainingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlayerTraining::class);
    }

    // /**
    //  * @return PlayerTraining[] Returns an array of PlayerTraining objects
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
    public function findOneBySomeField($value): ?PlayerTraining
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
