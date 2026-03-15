import { Shell } from "@/components/layout/Shell";
import { usePhysicalAssets, useAssetBookings, useCreateAssetBooking, useCreatePhysicalAsset, useCancelAssetBooking } from "@/hooks/use-bookings";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays, Plus, Loader2, Building2, Beaker, Armchair,
  Clock, User, CalendarIcon, X, Info,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ASSET_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  meeting_room: Building2,
  lab_equipment: Beaker,
  hot_desk: Armchair,
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  meeting_room: "Meeting Room",
  lab_equipment: "Lab Equipment",
  hot_desk: "Hot Desk",
};

const ASSET_TYPE_COLORS: Record<string, string> = {
  meeting_room: "bg-blue-500/10 text-blue-400",
  lab_equipment: "bg-green-500/10 text-green-400",
  hot_desk: "bg-purple-500/10 text-purple-400",
};

function formatDateStr(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export default function AssetBooking() {
  const { user } = useAuth();
  const { data: assets, isLoading: assetsLoading } = usePhysicalAssets();
  const { data: bookings, isLoading: bookingsLoading } = useAssetBookings();
  const { data: users } = useUsers();
  const { mutateAsync: createBooking, isPending: bookingPending } = useCreateAssetBooking();
  const { mutateAsync: createAsset, isPending: assetPending } = useCreatePhysicalAsset();
  const { mutateAsync: cancelBooking } = useCancelAssetBooking();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [bookingStartTime, setBookingStartTime] = useState("09:00");
  const [bookingEndTime, setBookingEndTime] = useState("10:00");

  const isAdmin = user?.roleId === 1;
  const isIncubatee = user?.roleId === 2;

  const selectedDateStr = formatDateStr(selectedDate);

  const bookingsForDate = bookings?.filter(
    (b) => b.bookingDate === selectedDateStr && b.status === "confirmed"
  ) ?? [];

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const assetId = Number(selectedAssetId);
    const startTime = bookingStartTime;
    const endTime = bookingEndTime;

    if (startTime >= endTime) {
      toast({ title: "Invalid time", description: "End time must be after start time.", variant: "destructive" });
      return;
    }

    // Check for conflicts
    const conflict = bookings?.find(
      (b) =>
        b.assetId === assetId &&
        b.bookingDate === selectedDateStr &&
        b.status === "confirmed" &&
        !(endTime <= b.startTime || startTime >= b.endTime)
    );
    if (conflict) {
      toast({ title: "Time conflict", description: "This asset is already booked for the selected time slot.", variant: "destructive" });
      return;
    }

    try {
      await createBooking({
        assetId,
        bookedBy: user.id,
        bookingDate: selectedDateStr,
        startTime,
        endTime,
        purpose: (formData.get("purpose") as string) || null,
        status: "confirmed",
      });
      setIsBookingOpen(false);
      toast({ title: "Asset booked successfully!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAssetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createAsset({
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        description: (formData.get("description") as string) || null,
        capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
      });
      setIsAssetOpen(false);
      toast({ title: "Asset added successfully!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCancelBooking = async (id: number) => {
    try {
      await cancelBooking(id);
      toast({ title: "Booking cancelled" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getUserName = (userId: number) => users?.find((u) => u.id === userId)?.name ?? `User #${userId}`;
  const getAssetName = (assetId: number) => assets?.find((a) => a.id === assetId)?.name ?? `Asset #${assetId}`;

  const isLoading = assetsLoading || bookingsLoading;

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Asset Booking</h1>
          <p className="text-muted-foreground text-lg">
            {isAdmin ? "View and manage bookings for physical assets." : "Book meeting rooms, lab equipment, and hot desks."}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Dialog open={isAssetOpen} onOpenChange={setIsAssetOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl h-11 px-6 border-black/70 text-[#015185] hover:bg-white/5">
                  <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-black/70 text-[#015185]">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Add Physical Asset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAssetSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Asset Name</Label>
                    <Input name="name" required className="bg-white/50 border-black/70" placeholder="e.g. Conference Room A" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select name="type" required>
                      <SelectTrigger className="bg-white/50 border-black/70">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-black/70">
                        <SelectItem value="meeting_room">Meeting Room</SelectItem>
                        <SelectItem value="lab_equipment">Lab Equipment</SelectItem>
                        <SelectItem value="hot_desk">Hot Desk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" className="bg-white/50 border-black/70" placeholder="Optional description..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input name="capacity" type="number" min="1" className="bg-white/50 border-black/70" placeholder="e.g. 10" />
                  </div>
                  <Button type="submit" disabled={assetPending} className="w-full h-11 rounded-xl">
                    {assetPending ? <Loader2 className="animate-spin" /> : "Add Asset"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {isIncubatee && (
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                  <Plus className="mr-2 h-4 w-4" /> Book Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-black/70 text-white">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Book an Asset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Select name="assetId" required value={selectedAssetId} onValueChange={setSelectedAssetId}>
                      <SelectTrigger className="bg-white/50 border-black/70">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-black/70">
                        {assets?.map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.name} — {ASSET_TYPE_LABELS[a.type] ?? a.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <div className="text-sm text-muted-foreground px-1">
                      Booking for: <span className="text-white font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                      <span className="text-xs text-muted-foreground ml-2">(change via calendar below)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        required
                        className="bg-white/50 border-black/70"
                        value={bookingStartTime}
                        onChange={(e) => setBookingStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        required
                        className="bg-white/50 border-black/70"
                        value={bookingEndTime}
                        onChange={(e) => setBookingEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Textarea name="purpose" className="bg-white/50 border-black/70" placeholder="What will you use it for?" />
                  </div>
                  <Button type="submit" disabled={bookingPending} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700">
                    {bookingPending ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6 bg-white/5 border border-black/70">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <CalendarDays className="h-4 w-4 mr-2" /> Calendar View
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <User className="h-4 w-4 mr-2" /> All Bookings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Calendar View Tab */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar picker */}
              <Card className="p-4 border-white/5 bg-card/60 backdrop-blur-xl lg:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Select Date
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  className="rounded-xl w-full"
                />
              </Card>

              {/* Assets for selected date */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  {format(selectedDate, "MMMM d, yyyy")}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                    — {bookingsForDate.length} booking{bookingsForDate.length !== 1 ? "s" : ""}
                  </span>
                </h3>

                {assets?.length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-black/70 rounded-2xl">
                    <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No assets available yet.{isAdmin ? " Add an asset to get started." : ""}</p>
                  </div>
                )}

                {assets?.map((asset) => {
                  const Icon = ASSET_TYPE_ICONS[asset.type] ?? Building2;
                  const colorClass = ASSET_TYPE_COLORS[asset.type] ?? "bg-gray-500/10 text-gray-400";
                  const assetBookingsForDate = bookingsForDate.filter((b) => b.assetId === asset.id);

                  return (
                    <Card key={asset.id} className="p-5 border-white/5 bg-card/60 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{asset.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {ASSET_TYPE_LABELS[asset.type] ?? asset.type}
                              {asset.capacity ? ` · Capacity: ${asset.capacity}` : ""}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={assetBookingsForDate.length > 0 ? "border-yellow-500/50 text-yellow-400" : "border-green-500/50 text-green-400"}
                        >
                          {assetBookingsForDate.length > 0 ? `${assetBookingsForDate.length} booked` : "Available"}
                        </Badge>
                      </div>

                      {asset.description && (
                        <p className="text-sm text-muted-foreground mb-4 flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 shrink-0" />
                          {asset.description}
                        </p>
                      )}

                      {assetBookingsForDate.length > 0 ? (
                        <div className="space-y-2">
                          {assetBookingsForDate.map((b) => {
                            const canCancel = isAdmin || (isIncubatee && b.bookedBy === user?.id);
                            return (
                              <div key={b.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                                <div className="flex items-center gap-3 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-white font-medium">{b.startTime} – {b.endTime}</span>
                                  {isAdmin && (
                                    <span className="text-muted-foreground">· {getUserName(b.bookedBy)}</span>
                                  )}
                                  {b.purpose && (
                                    <span className="text-muted-foreground hidden md:inline">· {b.purpose}</span>
                                  )}
                                </div>
                                {canCancel && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-destructive hover:bg-destructive/10 rounded-lg"
                                    onClick={() => handleCancelBooking(b.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No bookings for this day.</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* All Bookings Tab (Admin only) */}
          {isAdmin && (
            <TabsContent value="all">
              <div className="space-y-4">
                {bookings?.filter((b) => b.status === "confirmed").length === 0 && (
                  <div className="py-16 text-center border-2 border-dashed border-black/70 rounded-2xl">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-white">No bookings yet</h3>
                    <p className="text-muted-foreground mt-1">Incubatees will appear here once they make bookings.</p>
                  </div>
                )}
                {bookings
                  ?.filter((b) => b.status === "confirmed")
                  .sort((a, b) => {
                    if (a.bookingDate !== b.bookingDate) return a.bookingDate < b.bookingDate ? -1 : 1;
                    return a.startTime < b.startTime ? -1 : 1;
                  })
                  .map((booking) => {
                    const asset = assets?.find((a) => a.id === booking.assetId);
                    const booker = users?.find((u) => u.id === booking.bookedBy);
                    const Icon = asset ? (ASSET_TYPE_ICONS[asset.type] ?? Building2) : Building2;
                    const colorClass = asset ? (ASSET_TYPE_COLORS[asset.type] ?? "bg-gray-500/10 text-gray-400") : "bg-gray-500/10 text-gray-400";

                    return (
                      <Card key={booking.id} className="p-5 border-white/5 bg-card/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{asset?.name ?? getAssetName(booking.assetId)}</p>
                              <p className="text-xs text-muted-foreground">
                                {asset ? (ASSET_TYPE_LABELS[asset.type] ?? asset.type) : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{format(new Date(booking.bookingDate + "T00:00:00"), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{booking.startTime} – {booking.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{booker?.name ?? getUserName(booking.bookedBy)}</span>
                            </div>
                            {booking.purpose && (
                              <span className="text-sm text-muted-foreground italic">"{booking.purpose}"</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </Shell>
  );
}
