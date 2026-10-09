import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import org.anarres.lzo.LzoAlgorithm;
import org.anarres.lzo.LzoConstraint;
import org.anarres.lzo.LzoDecompressor;
import org.anarres.lzo.LzoLibrary;
import org.anarres.lzo.lzo_uintp;

public final class BenchJava {
    private static byte[] src;
    private static byte[] want;
    private static byte[] dst;
    private static LzoDecompressor decoder;
    private static lzo_uintp outLen;

    private static void decode() {
        outLen.value = dst.length;
        int rc = decoder.decompress(src, 0, src.length, dst, 0, outLen);
        if (rc != 0 || outLen.value != want.length) {
            throw new IllegalStateException("decode failed: rc=" + rc + " len=" + outLen.value);
        }
    }

    private static double measure(int ms) {
        long start = System.nanoTime();
        long deadline = start + ms * 1_000_000L;
        long calls = 0;
        do {
            for (int i = 0; i < 256; i++) decode();
            calls += 256;
        } while (System.nanoTime() < deadline);
        return (double) (System.nanoTime() - start) / calls;
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 4) throw new IllegalArgumentException("usage: BenchJava compressed expected trial-ms trials");
        src = Files.readAllBytes(Path.of(args[0]));
        want = Files.readAllBytes(Path.of(args[1]));
        dst = new byte[want.length];
        outLen = new lzo_uintp(want.length);
        decoder = LzoLibrary.getInstance().newDecompressor(LzoAlgorithm.LZO1Z, LzoConstraint.SAFETY);
        int trialMs = Integer.parseInt(args[2]);
        int trials = Integer.parseInt(args[3]);
        if (trialMs < 1 || trials < 1 || trials > 100) throw new IllegalArgumentException();
        decode();
        if (!Arrays.equals(dst, want)) throw new IllegalStateException("output mismatch");
        measure(1500); // JIT warmup before timed samples
        double[] samples = new double[trials];
        for (int i = 0; i < trials; i++) samples[i] = measure(trialMs);
        if (!Arrays.equals(dst, want)) throw new IllegalStateException("output mismatch after timing");
        Arrays.sort(samples);
        double ns = samples[trials / 2];
        System.out.printf("Java lzo-java,%.2f,%.3f%n", ns, want.length / ns);
    }
}
