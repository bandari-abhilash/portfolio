package main

import (
	"bytes"
	"fmt"
	"os"
	"sort"
	"strconv"
	"time"

	lzo1z "github.com/bandari-abhilash/LZO-GO"
)

func main() {
	if len(os.Args) != 5 {
		panic("usage: bench compressed expected trial-ms trials")
	}
	src, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	want, err := os.ReadFile(os.Args[2])
	if err != nil {
		panic(err)
	}
	trialMs, err := strconv.Atoi(os.Args[3])
	if err != nil {
		panic(err)
	}
	trials, err := strconv.Atoi(os.Args[4])
	if err != nil {
		panic(err)
	}
	dst := make([]byte, len(want))
	decode := func() {
		n, err := lzo1z.Decompress(src, dst)
		if err != nil || n != len(want) {
			panic(fmt.Sprintf("decode: n=%d err=%v", n, err))
		}
	}
	decode()
	if !bytes.Equal(dst, want) {
		panic("output mismatch")
	}
	measure := func(ms int) float64 {
		deadline := time.Now().Add(time.Duration(ms) * time.Millisecond)
		start := time.Now()
		var calls int64
		for time.Now().Before(deadline) {
			for i := 0; i < 256; i++ {
				decode()
			}
			calls += 256
		}
		return float64(time.Since(start).Nanoseconds()) / float64(calls)
	}
	measure(1500) // warm up before timed samples
	samples := make([]float64, trials)
	for i := range samples {
		samples[i] = measure(trialMs)
	}
	if !bytes.Equal(dst, want) {
		panic("output mismatch after timing")
	}
	sort.Float64s(samples)
	ns := samples[len(samples)/2]
	fmt.Printf("Go,%.2f,%.3f\n", ns, float64(len(want))/ns)
}
