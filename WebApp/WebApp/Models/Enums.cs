﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public enum PassengerType
    {
        REGULAR = 0,
        STUDENT = 1,
        SENIOR  = 2,
    }

    public enum DayType
    {
        WORK_DAY = 0,
        SATURDAY = 1,
        SUNDAY   = 2,
    }

    //public enum TicketType
    //{
    //    HOUR    = ,
    //    DAY     = ,
    //    MONTH   = ,
    //    YEAR    = ,
    //}

    public enum ProcessingPhase
    {
        PENDING     = 0,
        ACCEPTED    = 1, 
        REJECTED    = 2
    }
}