package training.kafka.turkcell.mongo;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface IEmployeeRepository extends MongoRepository<Employee,String> {

    List<Employee> findByFirstName(String firstName);

    List<Employee> findByFirstNameAndLastName(String firstName,String lastName);

    List<Employee> findByWeightBetween(Integer min,Integer max);

    @Query("{firstName :  ?0}")
    List<Employee> searchFirstName(String firstName);

    @Query(value = "{firstName :  ?0}",fields = "{firstName: 1,lastName: 1}")
    List<Employee> searchFirstName2(String firstName);

    @Aggregation(pipeline = {
            "{ $match : {height :  {$gt :  ?0}} }",
            "{ $sort : {firstName :  1}}"
    })
    List<Employee> aggregateHeight(Integer height);


}
