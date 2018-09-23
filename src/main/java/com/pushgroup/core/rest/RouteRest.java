package com.pushgroup.core.rest;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/")
public class RouteRest {

    @RequestMapping(method = RequestMethod.GET)
    public String getIndexPage() {
        return "index3";
    }


    @RequestMapping(method = RequestMethod.GET, path = "/landing")
    public String getLandingPage(@RequestParam(value = "click_id", required = false)String clickId) {
        return "landing";
    }
    @RequestMapping(method = RequestMethod.GET, path = "/landing2")
    public String getLandingPage2(@RequestParam(value = "click_id", required = false)String clickId) {
        return "landing2";
    }
    @RequestMapping(method = RequestMethod.GET, path = "/landing3")
    public String getLandingPage3(@RequestParam(value = "click_id", required = false)String clickId) {
        return "landing3";
    }
    @RequestMapping(method = RequestMethod.GET, path = "/landing4")
    public String getLandingPage4(@RequestParam(value = "click_id", required = false)String clickId) {
        return "landing4";
    }
}
