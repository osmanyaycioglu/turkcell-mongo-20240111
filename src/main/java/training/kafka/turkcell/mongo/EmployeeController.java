package training.kafka.turkcell.mongo;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final IEmployeeRepository employeeRepository;
    private final ICommentRepository commentRepository;

    @PostMapping("/add")
    public String add(@RequestBody Employee employeeParam){
        commentRepository.saveAll(employeeParam.getComments());
        employeeRepository.save(employeeParam);
        return "OK";
    }

    @GetMapping("/getAll")
    public List<Employee> getAll(){
        return employeeRepository.findAll();
    }

    @GetMapping("/agg/height")
    public List<Employee> aggEmployeeHeight(@RequestParam("h") Integer height){
        return employeeRepository.aggregateHeight(height);
    }

}
