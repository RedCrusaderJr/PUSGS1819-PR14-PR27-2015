using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TimetableEntry
    {
        //CONTROLLER
        #region Fields
        private DayType _day = DayType.WORK_DAY;
        private int _lineId;
        #endregion

        [Key]
        public string TimetableEntryId { get; private set; }

        public DayType Day
        {
            get
            {
                return _day;
            }

            set
            {
                _day = value;
                TimetableEntryId = $"{Day}|{LineId.ToString()}";
            }
        }

        [ForeignKey("Line")]
        public int LineId
        {
            get
            {
                return _lineId;
            }

            set
            {
                _lineId = value;
                TimetableEntryId = $"{Day}|{LineId.ToString()}";
            }
        }
        public Line Line { get; set; }

        public string TimeOfDeparture { get; set; }

        public TimetableEntry()
        {

        }
    }
}