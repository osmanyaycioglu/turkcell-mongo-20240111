package training.kafka.turkcell.mongo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Employee {

    @Id
    private String employeeId;
    private String firstName;
    private String lastName;
    private Integer weight;
    private Integer height;


    private EmployeeDetails employeeDetails;

    @DBRef
    private List<Comment> comments;


}
