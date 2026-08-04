package monitor

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type SystemStats struct {
	CPUUsage    float64 `json:"cpu_usage"`
	MemTotal    uint64  `json:"mem_total_mb"`
	MemUsed     uint64  `json:"mem_used_mb"`
	MemFree     uint64  `json:"mem_free_mb"`
	MemPercent  float64 `json:"mem_percent"`
	DiskTotal   uint64  `json:"disk_total_gb"`
	DiskUsed    uint64  `json:"disk_used_gb"`
	DiskFree    uint64  `json:"disk_free_gb"`
	DiskPercent float64 `json:"disk_percent"`
	Uptime      string  `json:"uptime"`
	LoadAvg     string  `json:"load_avg"`
	Hostname    string  `json:"hostname"`
}

func GetStats() (*SystemStats, error) {
	stats := &SystemStats{}

	if host, err := os.Hostname(); err == nil {
		stats.Hostname = host
	}

	if f, err := os.Open("/proc/meminfo"); err == nil {
		defer f.Close()
		scanner := bufio.NewScanner(f)
		var memTotal, memAvailable, memFree, buffers, cached uint64
		for scanner.Scan() {
			fields := strings.Fields(scanner.Text())
			if len(fields) < 2 {
				continue
			}
			val, _ := strconv.ParseUint(fields[1], 10, 64)
			switch fields[0] {
			case "MemTotal:":
				memTotal = val
			case "MemAvailable:":
				memAvailable = val
			case "MemFree:":
				memFree = val
			case "Buffers:":
				buffers = val
			case "Cached:":
				cached = val
			}
		}
		stats.MemTotal = memTotal / 1024
		if memAvailable > 0 {
			stats.MemFree = memAvailable / 1024
		} else {
			stats.MemFree = (memFree + buffers + cached) / 1024
		}
		stats.MemUsed = stats.MemTotal - stats.MemFree
		if stats.MemTotal > 0 {
			stats.MemPercent = float64(stats.MemUsed) / float64(stats.MemTotal) * 100.0
		}
	}

	getCPUSample := func() (idle, total uint64) {
		if f, err := os.Open("/proc/stat"); err == nil {
			defer f.Close()
			scanner := bufio.NewScanner(f)
			if scanner.Scan() {
				fields := strings.Fields(scanner.Text())
				if len(fields) >= 5 && fields[0] == "cpu" {
					for i := 1; i < len(fields); i++ {
						val, _ := strconv.ParseUint(fields[i], 10, 64)
						total += val
						if i == 4 {
							idle = val
						}
					}
				}
			}
		}
		return
	}

	idle1, total1 := getCPUSample()
	time.Sleep(200 * time.Millisecond)
	idle2, total2 := getCPUSample()

	idleTicks := float64(idle2 - idle1)
	totalTicks := float64(total2 - total1)
	if totalTicks > 0 {
		stats.CPUUsage = 100.0 * (totalTicks - idleTicks) / totalTicks
	}

	var stat syscall.Statfs_t
	if err := syscall.Statfs("/", &stat); err == nil {
		stats.DiskTotal = (stat.Blocks * uint64(stat.Bsize)) / (1024 * 1024 * 1024)
		stats.DiskFree = (stat.Bavail * uint64(stat.Bsize)) / (1024 * 1024 * 1024)
		stats.DiskUsed = stats.DiskTotal - stats.DiskFree
		if stats.DiskTotal > 0 {
			stats.DiskPercent = float64(stats.DiskUsed) / float64(stats.DiskTotal) * 100.0
		}
	}

	if data, err := os.ReadFile("/proc/uptime"); err == nil {
		fields := strings.Fields(string(data))
		if len(fields) > 0 {
			if upSecs, err := strconv.ParseFloat(fields[0], 64); err == nil {
				d := time.Duration(upSecs * float64(time.Second))
				days := int(d.Hours()) / 24
				hours := int(d.Hours()) % 24
				mins := int(d.Minutes()) % 60
				stats.Uptime = fmt.Sprintf("%dd %dh %dm", days, hours, mins)
			}
		}
	}

	if data, err := os.ReadFile("/proc/loadavg"); err == nil {
		fields := strings.Fields(string(data))
		if len(fields) >= 3 {
			stats.LoadAvg = strings.Join(fields[:3], " ")
		}
	}

	return stats, nil
}
