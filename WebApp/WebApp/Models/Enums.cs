using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public enum RoleType
    {
        PASSENGER  = 0,
        CONTROLLER = 1,
        ADMIN      = 2,
    }

    public enum PassengerType
    {
        REGULAR = 0,
        STUDENT = 1,
        SENIOR  = 2,
    }

    public enum TicketType
    {
        HOUR  = 0,
        DAY   = 1,
        MONTH = 2,
        YEAR  = 3,
    }
}