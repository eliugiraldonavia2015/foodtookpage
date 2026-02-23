import { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_ecuadorLow from "@amcharts/amcharts5-geodata/ecuadorLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface EcuadorMapProps {
  data: any[];
  metric: string;
}

export function EcuadorMap({ data, metric }: EcuadorMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const galapagosRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // --- MAINLAND MAP ---
    let root = am5.Root.new(chartRef.current as HTMLElement);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        wheelY: "none",
        projection: am5map.geoMercator(),
        layout: root.horizontalLayout
      })
    );

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_ecuadorLow,
        valueField: "value",
        calculateAggregates: true,
        exclude: ["EC-W"] // Exclude Galapagos from main map
      })
    );

    // --- GALAPAGOS MAP ---
    let rootGalapagos = am5.Root.new(galapagosRef.current as HTMLElement);
    
    rootGalapagos.setThemes([
      am5themes_Animated.new(rootGalapagos)
    ]);

    let chartGalapagos = rootGalapagos.container.children.push(
      am5map.MapChart.new(rootGalapagos, {
        panX: "none",
        panY: "none",
        wheelY: "none",
        projection: am5map.geoMercator(),
      })
    );

    let galapagosSeries = chartGalapagos.series.push(
      am5map.MapPolygonSeries.new(rootGalapagos, {
        geoJSON: am5geodata_ecuadorLow,
        valueField: "value",
        calculateAggregates: true,
        include: ["EC-W"] // Only Galapagos
      })
    );

    // Shared styling function
    const configureSeries = (series: am5map.MapPolygonSeries) => {
      series.mapPolygons.template.setAll({
        tooltipText: "{name}",
        interactive: true,
        fill: am5.color(0x475569),
        stroke: am5.color(0x1e293b),
        strokeWidth: 1,
        templateField: "polygonSettings",
        toggleKey: "active",
      });

      // Fix hover: Scale from center using center point logic automatically handled by scale if center is correct.
      // To prevent shifting, we rely on amCharts default center scaling, but ensure toFront() is called.
      // If it shifts, it's often due to stroke width changes or shadow offset. We keep offset 0.
      series.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x3b82f6),
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
        shadowColor: am5.color(0x000000),
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0.5,
        scale: 1.05 
      });

      series.mapPolygons.template.events.on("pointerover", function(ev) {
        ev.target.toFront();
      });
    };

    configureSeries(polygonSeries);
    configureSeries(galapagosSeries);

    const provinceMapping: { [key: string]: string } = {
      'Pichincha': 'EC-P',
      'Guayas': 'EC-G',
      'Azuay': 'EC-A',
      'Manabí': 'EC-M',
      'Loja': 'EC-L',
      'Galapagos': 'EC-W'
    };

    const formattedData = data.map(item => {
      let value = 0;
      let tooltipVal = "";
      let extraInfo = "";
      
      const avgTicket = item.orders > 0 ? (item.gmv / item.orders).toFixed(2) : "0.00";

      if (metric === 'gmv') {
        value = item.gmv;
        tooltipVal = `$${item.gmv.toLocaleString()}`;
        extraInfo = `\nOrders: ${item.orders.toLocaleString()}\nAvg Ticket: $${avgTicket}`;
      } else if (metric === 'margin') {
        value = item.margin;
        tooltipVal = `${item.margin}%`;
        const profit = (item.gmv * (item.margin / 100)).toLocaleString(undefined, {maximumFractionDigits: 0});
        extraInfo = `\nGMV: $${item.gmv.toLocaleString()}\nEst. Profit: $${profit}`;
      } else if (metric === 'density') {
        value = item.density;
        tooltipVal = `${item.density} orders/km²`;
        extraInfo = `\nUsers: ${item.users.toLocaleString()}\nRestaurants: ${item.restaurants}`;
      }

      return {
        id: provinceMapping[item.name] || item.name,
        name: item.name,
        value: value,
        polygonSettings: {
          fill: metric === 'gmv' && item.gmv > 200000 ? am5.color(0x10B981) : 
                metric === 'gmv' && item.gmv > 100000 ? am5.color(0xF59E0B) :
                metric === 'gmv' ? am5.color(0xEF4444) :
                metric === 'margin' && item.margin > 20 ? am5.color(0x10B981) :
                metric === 'margin' && item.margin > 15 ? am5.color(0xF59E0B) :
                metric === 'margin' ? am5.color(0xEF4444) :
                metric === 'density' && item.density > 60 ? am5.color(0x3B82F6) :
                metric === 'density' && item.density > 40 ? am5.color(0x8B5CF6) :
                am5.color(0x64748B),
          tooltipText: value > 0 ? `[bold]${item.name}[/]\n${metric.toUpperCase()}: ${tooltipVal}${extraInfo}` : undefined
        }
      };
    });

    polygonSeries.data.setAll(formattedData);
    galapagosSeries.data.setAll(formattedData);

    // Zoom setup
    // Mainland: Focus on Ecuador minus Galapagos
    // Coordinates: -1.5, -78.5 roughly.
    polygonSeries.events.on("datavalidated", () => {
       chart.zoomToGeoPoint({ longitude: -78.2, latitude: -1.7 }, 1, true); 
    });

    // Galapagos: Focus on Galapagos
    galapagosSeries.events.on("datavalidated", () => {
       chartGalapagos.zoomToGeoPoint({ longitude: -90.5, latitude: -0.5 }, 12, true);
    });

    return () => {
      root.dispose();
      rootGalapagos.dispose();
    };
  }, [data, metric]);

  return (
    <div style={{ position: 'relative', width: "100%", height: "100%" }}>
      {/* Mainland Map */}
      <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "100%" }}></div>
      
      {/* Galapagos Inset Map */}
      <div className="absolute bottom-4 left-4 w-32 h-32 bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden shadow-lg backdrop-blur-sm">
        <div ref={galapagosRef} style={{ width: "100%", height: "100%" }}></div>
        <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-slate-400 font-medium tracking-widest uppercase pointer-events-none">Galápagos</span>
      </div>
    </div>
  );
}
