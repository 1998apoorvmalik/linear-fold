#ls -lt  static/pairingRes/ | tail -n +2 | awk '{print $6" "$7","$8}' | sort | uniq -c
echo "LinearFold"
grep "LF file" usrLog.txt | awk -F"[][ ]" '{print $3" "$4","$6}' | sort | uniq -c
echo "LinearPartition"
grep "LP file" usrLog.txt | awk -F"[][ ]" '{print $3" "$4","$6}' | sort | uniq -c
echo "Linear_all"
grep " file" usrLog.txt | awk -F"[][ ]" '{print $3" "$4","$6}' | sort -n | uniq -c
