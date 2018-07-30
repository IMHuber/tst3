package com.pushgroup.core.rest;



import com.pushgroup.core.dto.SubscriptionDto;
import com.pushgroup.core.service.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api")
public class SubscribeRest {
    
    @Autowired
    private SubscribeService subscribeService;



    @RequestMapping(path = "/subscribe", method = RequestMethod.POST)
    public @ResponseBody ResponseEntity subscribe(@RequestBody SubscriptionDto subscriptionDto){
        try {
            subscribeService.subscribe(subscriptionDto.toDomain());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body("");
        }
    }


    @RequestMapping(path = "/send", method = RequestMethod.GET)
    public @ResponseBody ResponseEntity send(){
        try {
            subscribeService.send();
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body("");
        }
    }

}
