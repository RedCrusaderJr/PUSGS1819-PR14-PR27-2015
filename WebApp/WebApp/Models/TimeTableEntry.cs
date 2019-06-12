using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WebApp.Models
{
    public class TimetableEntry
    {
        //CONTROLLER
        #region Fields
        private DayType _day = DayType.WORK_DAY;
        private string _lineId;
        #endregion

        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }



        [ForeignKey("Timetable")]
        public bool TimetableId { get; set; }

        [IgnoreDataMember]
        public Timetable Timetable { get; set; }

        public DayType Day
        {
            get
            {
                return _day;
            }

            set
            {
                _day = value;
                
            }
        }

        [ForeignKey("Line")]
        public string LineId
        {
            get
            {
                return _lineId;
            }

            set
            {
                _lineId = value;
            }
        }


        public Line Line { get; set; }

        public string TimeOfDeparture { get; set; }

        public TimetableEntry()
        {

        }
    }
}