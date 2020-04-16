<?php

namespace App\Repository;

use App\Entity\TrainingDay;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method TrainingDay|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrainingDay|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrainingDay[]    findAll()
 * @method TrainingDay[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrainingDayRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrainingDay::class);
    }

    // /**
    //  * @return TrainingDay[] Returns an array of TrainingDay objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TrainingDay
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
