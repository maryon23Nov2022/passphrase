package com.example.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pk/")
public class BotInfoController{
    @RequestMapping("getbotinfo/")
    public String getbotinfo(){
        return "skdflj";
    }
}