
public async Task<(int, object?)> GetBySearch(DanhSachHoSoBySearchRequest request)
{
    var qHoSoCongViec = (request.IsbaoQuanVinhVien == null) ? _context.HoSoCongViecs.Where(x => !x.IsDeleted).AsQueryable()
        : _context.HoSoCongViecs.Where(x => !x.IsDeleted && x.IsbaoQuanVinhVien == request.IsbaoQuanVinhVien).AsQueryable();
    var qDanhSachHoSo = _context.DanhSachHoSos.Include(x => x.HoSoCongViec).AsQueryable();

if (request.Group != null)
{
    var resultObjectGroup = (from hoSo in qHoSoCongViec
                             join mucLuc in _context.MucLucs on hoSo.DeMucId equals mucLuc.MucLucId
                             join mucLucCon in _context.MucLucCons on hoSo.DeMucNhoId equals mucLucCon.MucLucConId
                             let danhSachHoSo = qDanhSachHoSo.Where(x => x.HoSoCongViecID == hoSo.Id).FirstOrDefault()
                             select new ObjectGroupResponse
                             {
                                 Id = mucLucCon.MucLucConId,
                                 Key = mucLuc.TenMucLuc + " - " + mucLucCon.TenMucLuc,
                                Status = danhSachHoSo.Status ?? HoSoStatus.KhoiTao
                             });
    resultObjectGroup = resultObjectGroup.Where(x => x.Status == HoSoStatus.KhoiTao || x.Status == HoSoStatus.CoYKienChiDao);

    var resultGroup = await resultObjectGroup
                            .GroupBy(item => new { item.Key, item.Id })
                            .Select(group => new ObjectGroupResponse
                            {
                                Id = group.Key.Id,
                                Key = group.Key.Key,
                                Count = group.Count(),
                                Items = null,
                            }).ToListAsync();

    var countArray = 1;
    return new(countArray, resultGroup);
}
else
{
    List<string> demucFilter = new List<string>();
    request.Filter.ForEach(item =>
    {
        demucFilter.Add(item.Split(" - ")[1]);
    });
    var listDeMucNho = _context.MucLucCons.Where(x => demucFilter.Contains(x.TenMucLuc)).AsQueryable();
    var resultDMHS = (from hoSoCongViec in qHoSoCongViec
                      join mucLucCon in listDeMucNho on hoSoCongViec.DeMucNhoId equals mucLucCon.MucLucConId
    //....



    public class SearchGroupObjectRequest
    {
        public int NamHinhThanh { get; set; } = 0;
        public int DonViLapId { get; set; } = 0;
        public long? NguoiLapId { get; set; } = 0;
        public string? SoKyHieu { get; set; } = string.Empty;
        public bool? IsbaoQuanVinhVien { get; set; } = null;// check Bảo quản vĩnh viễn
        public int? ThoiGianBaoQuan { get; set; } = 0;//Số năm bảo quản
        public string? NguoiNhan { get; set; } = string.Empty;
        public string? TieuDe { get; set; } = string.Empty;
        public string? DeMuc { get; set; } = string.Empty;
        public string? GhiChu { get; set; } = string.Empty;
        public List<ParamSort>? Group { get; set; }
        public string? Selector { get; set; }
        public List<string?>? Filter { get; set; }
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public List<ParamSort>? Sort { get; set; }
    }   

    public class ParamSort
    {
        public string? Selector { get; set; }
        public bool? Desc { get; set; }
        public bool? IsExpanded { get; set; }
    }

        