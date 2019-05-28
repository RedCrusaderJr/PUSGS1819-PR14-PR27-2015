using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Persistence.Repository;
using WebApp.Persistence.Repository.ModelRepositories;

namespace WebApp.Persistence.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
		IAutobusRepository AutobusRepository { get; }
        ICataloguePriceRepository CataloguePriceRepository { get; }
        ICatalogueRepository CatalogueRepository { get; }
        IDiscountRepository DiscountRepository { get; }
        ILineRepository LineRepository { get; }
        ILocationRepository LocationRepository { get; }
        IPassengerRepository PassengerRepository { get; }
        IStationRepository StationRepository { get; }
        ITicketRepository TicketRepository { get; }
        ITimetableEntryRepository TimetableEntryRepository { get; }
        ITimetableRepository TimetableRepository { get; }

        int Complete();
    }
}
